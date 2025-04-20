export const settings_lang = {
    en: {
        project: 'Project',
        powered: 'Powered by',
        remove: 'Remove',
        edit: 'Edit & upload',
        create: 'Create file',
        upload: 'Upload file',
        error: 'Error',
        ota_done: 'OTA done',
        ota_error: 'OTA error',
        upl_done: 'Upload done',
        upl_error: 'Upload error',
        upload: 'Upload?',
        ota: 'Update firmware?',
        fetch_err: "Fetch error",
        dup: "Duplicated widget ID",
    },
    ru: {
        project: 'Проект',
        powered: 'Работает на библиотеке',
        remove: 'Удалить',
        edit: 'Редактировать',
        create: 'Создать файл',
        upload: 'Загрузить файл',
        error: 'Ошибка',
        ota_done: 'OTA завершено',
        ota_error: 'Ошибка OTA',
        upl_done: 'Загрузка завершена',
        upl_error: 'Ошибка загрузки',
        upload: 'Загрузить?',
        ota: 'Обновить прошивку?',
        fetch_err: "Ошибка скачивания",
        dup: "Одинаковый ID виджета",
    }
};

function getLang() {
    switch (navigator.language || navigator.userLanguage) {
        case 'ru-RU': case 'ru': return 'ru';
    }
    return 'en';
}

export const lang = settings_lang[getLang()];