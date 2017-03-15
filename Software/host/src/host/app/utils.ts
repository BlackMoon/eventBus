/**
 * Результат закрытия диалога
 */
export enum DialogResult {
    Cancel,
    OK    
}

/**
 * Интерфейс словаря
 */
export interface IDictionary<T> {
    [key: string]: T;
}