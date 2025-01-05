export const settings_lang = {
    en: {
        used: 'Used',
        project: 'Project',
        powered: 'Powered by',
        remove: 'Remove',
        edit: 'Edit & upload',
        create: 'Create file',
        upload: 'Upload file',
        error: 'Error',
    },
    ru: {
        used: 'Занято',
        project: 'Проект',
        powered: 'Работает на библиотеке',
        remove: 'Удалить',
        edit: 'Редактировать',
        create: 'Создать файл',
        upload: 'Загрузить файл',
        error: 'Ошибка',
    }
};

function getLang() {
    switch (navigator.language || navigator.userLanguage) {
        case 'ru-RU': case 'ru': return 'ru';
    }
    return 'en';
}

export const lang = settings_lang[getLang()];