import { MenuItem } from './models';

export const appMenu: Array<MenuItem> = [{
    id: 'users',
    abbr: 'Пользователи',
    name: 'Пользователи',
    iconCls: 'icon-md icon-team',
    route: 'users'
    //for:['administrators']
},
{
    id: 'monitor',
    abbr: 'Монитор',
    name: 'Монитор',
    iconCls: 'icon-sm icon-folder',
    route: 'monitor'
},
{
    id: 'events',
    abbr: 'События',
    name: 'События',
    iconCls: 'icon-md icon-approve',
    route: 'events'
}];