import fs from 'fs/promises';
import path from 'path';
import { Product, User, Order, Coupon, Platform } from '../../types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Generic database operations
export class JsonDatabase<T> {
  private filePath: string;

  constructor(filename: string) {
    this.filePath = path.join(DATA_DIR, filename);
  }

  async read(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  async write(data: T[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing ${this.filePath}:`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    const data = await this.read();
    return data.find((item: any) => item.id === id) || null;
  }

  async findMany(filter: (item: T) => boolean): Promise<T[]> {
    const data = await this.read();
    return data.filter(filter);
  }

  async create(item: T): Promise<T> {
    const data = await this.read();
    data.push(item);
    await this.write(data);
    return item;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const data = await this.read();
    const index = data.findIndex((item: any) => item.id === id);
    
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates };
    await this.write(data);
    return data[index];
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.read();
    const index = data.findIndex((item: any) => item.id === id);
    
    if (index === -1) return false;
    
    data.splice(index, 1);
    await this.write(data);
    return true;
  }
}

// Database instances
export const productsDb = new JsonDatabase<Product>('products.json');
export const usersDb = new JsonDatabase<User>('users.json');
export const ordersDb = new JsonDatabase<Order>('orders.json');
export const couponsDb = new JsonDatabase<Coupon>('coupons.json');

// Product-specific operations
export const ProductService = {
  async getAll(): Promise<Product[]> {
    return productsDb.read();
  },

  async getById(id: string): Promise<Product | null> {
    return productsDb.findById(id);
  },

  async getByCategory(category: string): Promise<Product[]> {
    return productsDb.findMany(product => product.category === category);
  },

  async getByPlatform(platform: string): Promise<Product[]> {
    return productsDb.findMany(product => product.platform.includes(platform as Platform));
  },

  async getFeatured(): Promise<Product[]> {
    const products = await productsDb.read();
    return products
      .filter(product => product.inStock && product.rating >= 4.0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  },

  async getOnSale(): Promise<Product[]> {
    return productsDb.findMany(product => product.discount > 0 && product.inStock);
  },

  async search(query: string): Promise<Product[]> {
    const products = await productsDb.read();
    const searchTerm = query.toLowerCase();
    
    return products.filter(product => 
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    );
  },

  async updateStock(id: string, quantity: number): Promise<Product | null> {
    const product = await productsDb.findById(id);
    if (!product) return null;

    const newStock = Math.max(0, product.stockCount - quantity);
    return productsDb.update(id, { 
      stockCount: newStock,
      inStock: newStock > 0 
    });
  }
};

// User-specific operations
export const UserService = {
  async getAll(): Promise<User[]> {
    return usersDb.read();
  },

  async getById(id: string): Promise<User | null> {
    return usersDb.findById(id);
  },

  async getByEmail(email: string): Promise<User | null> {
    const users = await usersDb.read();
    return users.find(user => user.email === email) || null;
  },

  async create(userData: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    
    return usersDb.create(user);
  },

  async updateLastLogin(id: string): Promise<User | null> {
    return usersDb.update(id, { lastLoginAt: new Date().toISOString() });
  },

  async addToWishlist(userId: string, productId: string): Promise<User | null> {
    const user = await usersDb.findById(userId);
    if (!user) return null;

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      return usersDb.update(userId, { wishlist: user.wishlist });
    }
    
    return user;
  },

  async removeFromWishlist(userId: string, productId: string): Promise<User | null> {
    const user = await usersDb.findById(userId);
    if (!user) return null;

    const wishlist = user.wishlist.filter((id: string) => id !== productId);
    return usersDb.update(userId, { wishlist });
  }
};

// Order-specific operations
export const OrderService = {
  async getAll(): Promise<Order[]> {
    return ordersDb.read();
  },

  async getById(id: string): Promise<Order | null> {
    return ordersDb.findById(id);
  },

  async getByUserId(userId: string): Promise<Order[]> {
    return ordersDb.findMany(order => order.userId === userId);
  },

  async create(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const orderNumber = `CALEB-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    const order: Order = {
      ...orderData,
      id: `order_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return ordersDb.create(order);
  },

  async updateStatus(
    id: string, 
    status: Order['status'], 
    paymentStatus?: Order['paymentStatus'],
    deliveryStatus?: Order['deliveryStatus']
  ): Promise<Order | null> {
    const updates: Partial<Order> = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (deliveryStatus) updates.deliveryStatus = deliveryStatus;
    if (status === 'completed') updates.completedAt = new Date().toISOString();

    return ordersDb.update(id, updates);
  },

  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    const orders = await ordersDb.read();
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
};

// Initialize database files if they don't exist
export async function initializeDatabase(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  const files = ['products.json', 'users.json', 'orders.json', 'coupons.json'];
  
  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, '[]');
    }
  }
} 