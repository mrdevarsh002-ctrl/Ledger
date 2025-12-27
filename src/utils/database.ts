import { createClient } from './supabase/client';
import { Transaction, Site } from '../App';

// Check if database tables exist
export async function checkDatabaseSetup(): Promise<boolean> {
  const supabase = createClient();
  
  try {
    // Try to query the transactions table
    const { error } = await supabase
      .from('transactions')
      .select('id')
      .limit(1);
    
    // If no error or error is not about missing table, database is set up
    return !error || (error.code !== 'PGRST204' && error.code !== 'PGRST205');
  } catch (error) {
    return false;
  }
}

// Initialize database tables
export async function initializeDatabase(userId: string) {
  const supabase = createClient();

  // Check if tables exist, if not they should be created via Supabase dashboard
  // For now, we'll just ensure the user has their data synced
  try {
    // Fetch existing data
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    const { data: sites } = await supabase
      .from('sites')
      .select('*')
      .eq('user_id', userId);

    return {
      transactions: transactions || [],
      sites: sites || [],
    };
  } catch (error) {
    console.error('Error initializing database:', error);
    return {
      transactions: [],
      sites: [],
    };
  }
}

// Transaction operations
export async function addTransaction(userId: string, transaction: Omit<Transaction, 'id'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      name: transaction.name,
      amount: transaction.amount,
      type: transaction.type,
      person_type: transaction.personType,
      note: transaction.note,
      additional_notes: transaction.additionalNotes,
      date: transaction.date,
      site: transaction.site,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    amount: data.amount,
    type: data.type,
    personType: data.person_type,
    note: data.note,
    additionalNotes: data.additional_notes,
    date: data.date,
    site: data.site,
  } as Transaction;
}

export async function updateTransaction(userId: string, transactionId: string, transaction: Omit<Transaction, 'id'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('transactions')
    .update({
      name: transaction.name,
      amount: transaction.amount,
      type: transaction.type,
      person_type: transaction.personType,
      note: transaction.note,
      additional_notes: transaction.additionalNotes,
      date: transaction.date,
      site: transaction.site,
    })
    .eq('id', transactionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    amount: data.amount,
    type: data.type,
    personType: data.person_type,
    note: data.note,
    additionalNotes: data.additional_notes,
    date: data.date,
    site: data.site,
  } as Transaction;
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    // Suppress PGRST205 errors (table doesn't exist) - this is expected before database setup
    if (error.code !== 'PGRST205') {
      console.error('Error fetching transactions:', error);
    }
    return [];
  }

  return (data || []).map(convertFromDb);
}

// Site operations
export async function addSite(userId: string, site: { name: string; budget: number }) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('sites')
    .insert([{
      user_id: userId,
      name: site.name,
      budget: site.budget,
      created_date: new Date().toISOString().split('T')[0],
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding site:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    budget: data.budget,
    createdDate: data.created_date,
  } as Site;
}

export async function deleteSite(userId: string, siteId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', siteId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting site:', error);
    throw error;
  }
}

export async function getSites(userId: string): Promise<Site[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', userId)
    .order('created_date', { ascending: false });

  if (error) {
    // Suppress PGRST205 errors (table doesn't exist) - this is expected before database setup
    if (error.code !== 'PGRST205') {
      console.error('Error fetching sites:', error);
    }
    return [];
  }

  return (data || []).map(d => ({
    id: d.id,
    name: d.name,
    budget: d.budget,
    createdDate: d.created_date,
  }));
}

// User preferences
export async function updateUserPreferences(userId: string, preferences: { userName?: string; language?: string; theme?: string }) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      user_name: preferences.userName,
      language: preferences.language,
      theme: preferences.theme,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    // Suppress PGRST205 errors (table doesn't exist) - this is expected before database setup
    if (error.code !== 'PGRST205') {
      console.error('Error updating preferences:', error);
    }
    throw error;
  }
}

export async function getUserPreferences(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // User preferences don't exist yet or table doesn't exist
    // This is expected, just return null
    return null;
  }

  return {
    userName: data.user_name,
    language: data.language,
    theme: data.theme,
  };
}

// Helper function to convert database transaction to Transaction type
function convertFromDb(dbTransaction: any): Transaction {
  return {
    id: dbTransaction.id,
    name: dbTransaction.name,
    amount: dbTransaction.amount,
    type: dbTransaction.type,
    personType: dbTransaction.person_type,
    note: dbTransaction.note,
    additionalNotes: dbTransaction.additional_notes,
    date: dbTransaction.date,
    site: dbTransaction.site,
  };
}