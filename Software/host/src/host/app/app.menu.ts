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
        id: 'monitor1',
        abbr: 'Монитор1',
        name: 'Монитор1',
        iconCls: 'icon-sm icon-folder',
        route: 'query/users-tree'
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