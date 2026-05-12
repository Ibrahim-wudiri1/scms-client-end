/**
 * Offline Sales Context
 * Manages cart, offline sales creation, and sync status
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { findWhere, insert, update, deleteRecord, findById } from '../lib/db/dbManager';
import { addToSyncQueue } from '../lib/offline/syncQueue';

const OfflineSalesContext = createContext();

export function OfflineSalesProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [lastSaleId, setLastSaleId] = useState(null);
  const [saleStatus, setSaleStatus] = useState(null); // null, 'pending', 'synced', 'failed'

  // Load cart from SQLite on mount
  useEffect(() => {
    loadCartFromDb();
  }, []);

  /**
   * Load cart from database
   */
  const loadCartFromDb = useCallback(() => {
    try {
      // Find the current unsaved sale (status='pending')
      const pendingSales = findWhere('sales', { status: 'pending', createdOffline: 1 });
      
      if (pendingSales.length > 0) {
        const sale = pendingSales[0];
        const saleItems = findWhere('saleItems', { saleId: sale.id });
        
        setLastSaleId(sale.id);
        setSaleStatus(sale.syncedAt ? 'synced' : 'pending');
        setCart(saleItems);
        
        // Recalculate total
        const total = saleItems.reduce((sum, item) => sum + (item.lineTotal || item.price * item.quantity), 0);
        setCartTotal(total);
        setCartItemCount(saleItems.length);
      }
    } catch (error) {
      console.error('Failed to load cart from db:', error);
    }
  }, []);

  /**
   * Add product to cart
   */
  const addToCart = useCallback((product, quantity) => {
    try {
      const existingItem = cart.find(item => item.productId === product.id);

      if (existingItem) {
        // Increase quantity
        const newQuantity = existingItem.quantity + quantity;
        const updatedItem = {
          ...existingItem,
          quantity: newQuantity,
          lineTotal: newQuantity * existingItem.price,
        };
        
        // Update in database
        update('saleItems', existingItem.id, updatedItem);
        
        // Update local state
        const newCart = cart.map(item =>
          item.id === existingItem.id ? updatedItem : item
        );
        setCart(newCart);
      } else {
        // Add new item
        const saleItem = {
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          saleId: lastSaleId || `temp_${Date.now()}`,
          productId: product.id,
          quantity,
          price: product.sellingPrice,
          lineTotal: product.sellingPrice * quantity,
        };

        insert('saleItems', saleItem);
        setCart([...cart, saleItem]);
      }

      // Recalculate totals
      const newTotal = [...cart, ...cart].reduce((sum, item) => sum + (item.lineTotal || 0), 0);
      setCartTotal(newTotal);
      setCartItemCount(cart.length + 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  }, [cart, lastSaleId]);

  /**
   * Remove item from cart
   */
  const removeFromCart = useCallback((itemId) => {
    try {
      deleteRecord('saleItems', itemId);
      const newCart = cart.filter(item => item.id !== itemId);
      setCart(newCart);

      // Recalculate totals
      const newTotal = newCart.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
      setCartTotal(newTotal);
      setCartItemCount(newCart.length);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  }, [cart]);

  /**
   * Update cart item quantity
   */
  const updateCartItem = useCallback((itemId, newQuantity) => {
    try {
      const item = cart.find(i => i.id === itemId);
      if (!item) return;

      const updatedItem = {
        ...item,
        quantity: newQuantity,
        lineTotal: newQuantity * item.price,
      };

      update('saleItems', itemId, updatedItem);
      
      const newCart = cart.map(i => i.id === itemId ? updatedItem : i);
      setCart(newCart);

      // Recalculate totals
      const newTotal = newCart.reduce((sum, i) => sum + (i.lineTotal || 0), 0);
      setCartTotal(newTotal);
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  }, [cart]);

  /**
   * Clear cart
   */
  const clearCart = useCallback(() => {
    try {
      cart.forEach(item => {
        deleteRecord('saleItems', item.id);
      });
      setCart([]);
      setCartTotal(0);
      setCartItemCount(0);
      setLastSaleId(null);
      setSaleStatus(null);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }, [cart]);

  /**
   * Create sale (save to database - will be synced later)
   */
  const createSaleOffline = useCallback(async (saleData) => {
    try {
      if (cart.length === 0) {
        throw new Error('Cart is empty');
      }

      const saleId = `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const offlineId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const sale = {
        id: saleId,
        offlineId,
        shopId: saleData.shopId,
        tenantId: saleData.tenantId,
        userId: saleData.userId,
        totalAmount: cartTotal,
        paymentType: saleData.paymentType || 'CASH',
        customerId: saleData.customerId || null,
        status: navigator.onLine ? 'completed' : 'pending',
        syncedAt: navigator.onLine ? new Date().toISOString() : null,
        createdOffline: !navigator.onLine ? 1 : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Insert sale to database
      insert('sales', sale);

      // Update cart items with sale ID
      cart.forEach(item => {
        update('saleItems', item.id, { saleId });
      });

      // Create stock movements
      cart.forEach(item => {
        const movement = {
          id: `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: item.productId,
          saleId,
          shopId: saleData.shopId,
          tenantId: saleData.tenantId,
          type: 'OUT',
          quantity: item.quantity,
          userId: saleData.userId,
          notes: `Sale: ${offlineId}`,
          createdAt: new Date().toISOString(),
        };
        insert('stockMovements', movement);
      });

      // If offline, add to sync queue
      if (!navigator.onLine) {
        await addToSyncQueue('CREATE', 'SALE', saleId, {
          id: saleId,
          offlineId,
          shopId: saleData.shopId,
          tenantId: saleData.tenantId,
          userId: saleData.userId,
          totalAmount: cartTotal,
          paymentType: saleData.paymentType,
          customerId: saleData.customerId,
          items: cart,
        }, 1); // Priority 1 (sales)

        setSaleStatus('pending');
      } else {
        setSaleStatus('synced');
      }

      setLastSaleId(saleId);
      clearCart();

      return {
        success: true,
        saleId,
        offlineId,
        totalAmount: cartTotal,
        itemCount: cart.length,
        queued: !navigator.onLine,
      };
    } catch (error) {
      console.error('Failed to create sale:', error);
      throw error;
    }
  }, [cart, cartTotal, clearCart]);

  /**
   * Get sale sync status
   */
  const getSaleSyncStatus = useCallback((saleId) => {
    try {
      const sale = findById('sales', saleId);
      if (!sale) return null;

      return {
        saleId,
        status: sale.syncedAt ? 'synced' : 'pending',
        createdOffline: sale.createdOffline,
        syncedAt: sale.syncedAt,
        offlineId: sale.offlineId,
      };
    } catch (error) {
      console.error('Failed to get sale sync status:', error);
      return null;
    }
  }, []);

  /**
   * Get recent offline sales (for display)
   */
  const getRecentOfflineSales = useCallback(() => {
    try {
      const offlineSales = findWhere('sales', { createdOffline: 1 });
      return offlineSales.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    } catch (error) {
      console.error('Failed to get recent offline sales:', error);
      return [];
    }
  }, []);

  const value = {
    // State
    cart,
    cartTotal,
    cartItemCount,
    lastSaleId,
    saleStatus,

    // Methods
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    createSaleOffline,
    getSaleSyncStatus,
    getRecentOfflineSales,
    loadCartFromDb,
  };

  return (
    <OfflineSalesContext.Provider value={value}>
      {children}
    </OfflineSalesContext.Provider>
  );
}

/**
 * Hook to use offline sales context
 */
export function useOfflineSales() {
  const context = useContext(OfflineSalesContext);
  if (!context) {
    throw new Error('useOfflineSales must be used within OfflineSalesProvider');
  }
  return context;
}
