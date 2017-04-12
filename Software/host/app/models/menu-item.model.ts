/**
 * Группы пользователей
 */
export const AdministratorsGroup = 'administrators';
export const UsersGroup = 'users';

export class MenuItem {

    abbr?: string;

    active?: boolean;

    details?: { iconCls: string; title: string; } = null;

    iconCls?: string;

    id: string;

    name: string;

    route: string;
    
    title?: string;

    /**
     * Доступно для пользователей из списка [может указываться группа administrators/users]
     */    
    for?: Array<string>;    

    /**
     * Недоступно для пользователей из списка [может указываться группа administrators/users]
     */
    not?: Array<string>;    
}