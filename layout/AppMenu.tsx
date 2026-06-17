import AppSubMenu from './AppSubMenu';
import type { MenuModel } from '@/types';

const AppMenu = () => {
    const model: MenuModel[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: 'SchoolKid Dashboard',
                    icon: 'pi pi-fw pi-home',
                    to: '/'
                }
            ]
        },
        {
            label: 'Programs',
            icon: 'pi pi-fw pi-book',
            items: [
                {
                    label: 'All Programs',
                    icon: 'pi pi-fw pi-list',
                    to: '/program'
                },
                {
                    label: 'Create Program',
                    icon: 'pi pi-fw pi-plus',
                    to: '/program/create'
                }
            ]
        },
        {
            label: 'Applications',
            icon: 'pi pi-fw pi-inbox',
            items: [
                {
                    label: 'Application List',
                    icon: 'pi pi-fw pi-list',
                    to: '/applications'
                }
            ]
        },
        {
            label: 'Content',
            icon: 'pi pi-fw pi-file-edit',
            items: [
                {
                    label: 'News Articles',
                    icon: 'pi pi-fw pi-file',
                    to: '/news-articles'
                },
                {
                    label: 'Create Article',
                    icon: 'pi pi-fw pi-plus',
                    to: '/news-articles/create'
                },
                {
                    label: 'Promotional Videos',
                    icon: 'pi pi-fw pi-video',
                    to: '/promotional-video'
                },
                {
                    label: 'Create Video',
                    icon: 'pi pi-fw pi-plus',
                    to: '/promotional-video/create'
                },
                {
                    label: 'Newsletter',
                    icon: 'pi pi-fw pi-envelope',
                    to: '/newsletter'
                },
                {
                    label: 'Site Content',
                    icon: 'pi pi-fw pi-cog',
                    to: '/site-content'
                }
            ]
        }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;