import Transaction from '../models/Transaction';

interface CreateAppointmentDTO {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let income = 0;
    let outcome = 0;
    this.transactions.map(transaction => {
      if (transaction.type === 'income') {
        income += transaction.value;
      } else if (transaction.type === 'outcome') {
        outcome += transaction.value;
      }
      return transaction;
    });
    const balance = {
      income,
      outcome,
      total: income -= outcome,
    };

    return balance;
  }

  public create({ title, value, type }: CreateAppointmentDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    if (
      transaction.type === 'outcome' &&
      this.getBalance().total < transaction.value
    ) {
      throw new Error('Not have money enough');
    }
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
