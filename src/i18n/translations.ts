import type { LanguageOption } from '../types/habit';

export type I18nKey =
  | 'lifeOs'
  | 'dashboard'
  | 'bookJournal'
  | 'workoutPlanner'
  | 'shoppingLists'
  | 'budgetPlanner'
  | 'watchReadLater'
  | 'notes'
  | 'settings'
  | 'logout'
  | 'weeklyPlanner'
  | 'readOnlyWeek'
  | 'totalPoints'
  | 'dailyGoalProgress'
  | 'levelProgress'
  | 'levelMission'
  | 'levelMissionHint'
  | 'weekTaskProgress'
  | 'weekPointProgress'
  | 'close'
  | 'themeAndColors'
  | 'mode'
  | 'language'
  | 'font'
  | 'primaryAccent'
  | 'secondaryButtons'
  | 'background'
  | 'panelColor'
  | 'innerPanels'
  | 'dailyGoal'
  | 'setPastReadOnly'
  | 'resetApp'
  | 'resetAppDesc'
  | 'newShoppingList'
  | 'addList'
  | 'edit'
  | 'renameList'
  | 'deleteList'
  | 'addItem'
  | 'itemName'
  | 'priceOptional'
  | 'quantity'
  | 'cancel'
  | 'save'
  | 'noItems'
  | 'newFolderName'
  | 'addFolder'
  | 'folders'
  | 'noFoldersYet'
  | 'backToFolders'
  | 'notesInFolder'
  | 'selectFolder'
  | 'noteTitle'
  | 'noteContent'
  | 'addNote'
  | 'rename'
  | 'delete'
  | 'editNote'
  | 'deleteNote'
  | 'noNotesInFolder'
  | 'english'
  | 'turkish'
  | 'spanish'
  | 'french';

const messages: Record<LanguageOption, Record<I18nKey, string>> = {
  en: {
    lifeOs: 'Life OS',
    dashboard: 'Dashboard',
    bookJournal: 'Book Journal',
    workoutPlanner: 'Workout Planner',
    shoppingLists: 'Shopping Lists',
    budgetPlanner: 'Budget Planner',
    watchReadLater: 'Watch-Read Later',
    notes: 'Notes',
    settings: 'Settings',
    logout: 'Logout',
    weeklyPlanner: 'Weekly Planner',
    readOnlyWeek: 'This past week is read-only.',
    totalPoints: 'Total Points',
    dailyGoalProgress: 'Daily Goal Progress',
    levelProgress: 'Level Progress',
    levelMission: 'Level mission',
    levelMissionHint: 'Complete this week and reach the point goal to level up.',
    weekTaskProgress: 'Week tasks',
    weekPointProgress: 'Week points',
    close: 'Close',
    themeAndColors: 'Theme & Colors',
    mode: 'Mode',
    language: 'Language',
    font: 'Font',
    primaryAccent: 'Primary Accent',
    secondaryButtons: 'Secondary (Buttons)',
    background: 'Background',
    panelColor: 'Panel / Sidebar',
    innerPanels: 'Inner Panels',
    dailyGoal: 'Daily goal',
    setPastReadOnly: 'Set past weeks as read-only',
    resetApp: 'Reset App',
    resetAppDesc: 'Clears your planner, habits, books, sports, shopping, budget and watch list data.',
    newShoppingList: 'New shopping list',
    addList: 'Add List',
    edit: 'Edit',
    renameList: 'Rename list',
    deleteList: 'Delete list',
    addItem: 'Add',
    itemName: 'Item name',
    priceOptional: 'Price (optional)',
    quantity: 'Quantity',
    cancel: 'Cancel',
    save: 'Save',
    noItems: 'No items.',
    newFolderName: 'New folder name',
    addFolder: 'Add Folder',
    folders: 'Folders',
    noFoldersYet: 'No folders yet.',
    backToFolders: 'Back to folders',
    notesInFolder: 'Notes in "{{name}}"',
    selectFolder: 'Select a folder',
    noteTitle: 'Note title',
    noteContent: 'Write your note',
    addNote: 'Add Note',
    rename: 'Rename',
    delete: 'Delete',
    editNote: 'Edit note',
    deleteNote: 'Delete note',
    noNotesInFolder: 'No notes in this folder yet.',
    english: 'English',
    turkish: 'Turkish',
    spanish: 'Spanish',
    french: 'French'
  },
  tr: {
    lifeOs: 'Life OS',
    dashboard: 'Panel',
    bookJournal: 'Kitap Günlüğü',
    workoutPlanner: 'Antrenman Planlayıcı',
    shoppingLists: 'Alışveriş Listeleri',
    budgetPlanner: 'Bütçe Planlayıcı',
    watchReadLater: 'İzle-Oku Sonra',
    notes: 'Notlar',
    settings: 'Ayarlar',
    logout: 'Çıkış',
    weeklyPlanner: 'Haftalık Planlayıcı',
    readOnlyWeek: 'Geçmiş hafta salt okunur.',
    totalPoints: 'Toplam Puan',
    dailyGoalProgress: 'Günlük Hedef İlerlemesi',
    levelProgress: 'Seviye İlerlemesi',
    levelMission: 'Seviye görevi',
    levelMissionHint: 'Seviye atlamak için haftayı tamamla ve puan hedefini doldur.',
    weekTaskProgress: 'Haftalık görev',
    weekPointProgress: 'Haftalık puan',
    close: 'Kapat',
    themeAndColors: 'Tema ve Renkler',
    mode: 'Mod',
    language: 'Dil',
    font: 'Yazı tipi',
    primaryAccent: 'Birincil Vurgu',
    secondaryButtons: 'İkincil (Butonlar)',
    background: 'Arka plan',
    panelColor: 'Panel / Kenar menü',
    innerPanels: 'İç Paneller',
    dailyGoal: 'Günlük hedef',
    setPastReadOnly: 'Geçmiş haftaları salt okunur yap',
    resetApp: 'Uygulamayı Sıfırla',
    resetAppDesc: 'Planlayıcı, alışkanlıklar, kitap, spor, alışveriş, bütçe ve izleme listesi verilerini temizler.',
    newShoppingList: 'Yeni alışveriş listesi',
    addList: 'Liste Ekle',
    edit: 'Düzenle',
    renameList: 'Listeyi yeniden adlandır',
    deleteList: 'Listeyi sil',
    addItem: 'Ekle',
    itemName: 'Ürün adı',
    priceOptional: 'Fiyat (opsiyonel)',
    quantity: 'Adet',
    cancel: 'İptal',
    save: 'Kaydet',
    noItems: 'Öğe yok.',
    newFolderName: 'Yeni klasör adı',
    addFolder: 'Klasör Ekle',
    folders: 'Klasörler',
    noFoldersYet: 'Henüz klasör yok.',
    backToFolders: 'Klasörlere dön',
    notesInFolder: '"{{name}}" içindeki notlar',
    selectFolder: 'Bir klasör seç',
    noteTitle: 'Not başlığı',
    noteContent: 'Notunu yaz',
    addNote: 'Not Ekle',
    rename: 'Yeniden adlandır',
    delete: 'Sil',
    editNote: 'Notu düzenle',
    deleteNote: 'Notu sil',
    noNotesInFolder: 'Bu klasörde henüz not yok.',
    english: 'İngilizce',
    turkish: 'Türkçe',
    spanish: 'İspanyolca',
    french: 'Fransızca'
  },
  es: {
    lifeOs: 'Life OS',
    dashboard: 'Panel',
    bookJournal: 'Diario de Libros',
    workoutPlanner: 'Plan de Entrenamiento',
    shoppingLists: 'Listas de Compras',
    budgetPlanner: 'Planificador de Presupuesto',
    watchReadLater: 'Ver-Leer Después',
    notes: 'Notas',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    weeklyPlanner: 'Planificador Semanal',
    readOnlyWeek: 'Esta semana pasada es de solo lectura.',
    totalPoints: 'Puntos Totales',
    dailyGoalProgress: 'Progreso de Meta Diaria',
    levelProgress: 'Progreso de Nivel',
    levelMission: 'Misión de nivel',
    levelMissionHint: 'Completa la semana y alcanza la meta de puntos para subir de nivel.',
    weekTaskProgress: 'Tareas semanales',
    weekPointProgress: 'Puntos semanales',
    close: 'Cerrar',
    themeAndColors: 'Tema y Colores',
    mode: 'Modo',
    language: 'Idioma',
    font: 'Fuente',
    primaryAccent: 'Acento Primario',
    secondaryButtons: 'Secundario (Botones)',
    background: 'Fondo',
    panelColor: 'Panel / Barra lateral',
    innerPanels: 'Paneles internos',
    dailyGoal: 'Meta diaria',
    setPastReadOnly: 'Bloquear semanas pasadas',
    resetApp: 'Restablecer app',
    resetAppDesc: 'Borra datos del planificador, hábitos, libros, deportes, compras, presupuesto y lista de pendientes.',
    newShoppingList: 'Nueva lista de compras',
    addList: 'Agregar lista',
    edit: 'Editar',
    renameList: 'Renombrar lista',
    deleteList: 'Eliminar lista',
    addItem: 'Agregar',
    itemName: 'Nombre del artículo',
    priceOptional: 'Precio (opcional)',
    quantity: 'Cantidad',
    cancel: 'Cancelar',
    save: 'Guardar',
    noItems: 'Sin artículos.',
    newFolderName: 'Nuevo nombre de carpeta',
    addFolder: 'Agregar carpeta',
    folders: 'Carpetas',
    noFoldersYet: 'Aún no hay carpetas.',
    backToFolders: 'Volver a carpetas',
    notesInFolder: 'Notas en "{{name}}"',
    selectFolder: 'Selecciona una carpeta',
    noteTitle: 'Título de nota',
    noteContent: 'Escribe tu nota',
    addNote: 'Agregar nota',
    rename: 'Renombrar',
    delete: 'Eliminar',
    editNote: 'Editar nota',
    deleteNote: 'Eliminar nota',
    noNotesInFolder: 'No hay notas en esta carpeta.',
    english: 'Inglés',
    turkish: 'Turco',
    spanish: 'Español',
    french: 'Francés'
  },
  fr: {
    lifeOs: 'Life OS',
    dashboard: 'Tableau de bord',
    bookJournal: 'Journal de Lecture',
    workoutPlanner: 'Plan d’Entraînement',
    shoppingLists: 'Listes de Courses',
    budgetPlanner: 'Planificateur Budget',
    watchReadLater: 'À voir-lire plus tard',
    notes: 'Notes',
    settings: 'Paramètres',
    logout: 'Se déconnecter',
    weeklyPlanner: 'Planificateur Hebdomadaire',
    readOnlyWeek: 'Cette semaine passée est en lecture seule.',
    totalPoints: 'Points Totaux',
    dailyGoalProgress: 'Progression Objectif Quotidien',
    levelProgress: 'Progression de Niveau',
    levelMission: 'Mission de niveau',
    levelMissionHint: 'Complète la semaine et atteins l’objectif de points pour monter de niveau.',
    weekTaskProgress: 'Tâches hebdomadaires',
    weekPointProgress: 'Points hebdomadaires',
    close: 'Fermer',
    themeAndColors: 'Thème et Couleurs',
    mode: 'Mode',
    language: 'Langue',
    font: 'Police',
    primaryAccent: 'Accent Principal',
    secondaryButtons: 'Secondaire (Boutons)',
    background: 'Arrière-plan',
    panelColor: 'Panneau / Barre latérale',
    innerPanels: 'Panneaux internes',
    dailyGoal: 'Objectif quotidien',
    setPastReadOnly: 'Rendre les semaines passées en lecture seule',
    resetApp: 'Réinitialiser l’app',
    resetAppDesc: 'Efface les données du planificateur, habitudes, livres, sport, shopping, budget et liste à regarder.',
    newShoppingList: 'Nouvelle liste de courses',
    addList: 'Ajouter une liste',
    edit: 'Modifier',
    renameList: 'Renommer la liste',
    deleteList: 'Supprimer la liste',
    addItem: 'Ajouter',
    itemName: 'Nom de l’élément',
    priceOptional: 'Prix (optionnel)',
    quantity: 'Quantité',
    cancel: 'Annuler',
    save: 'Enregistrer',
    noItems: 'Aucun élément.',
    newFolderName: 'Nom du nouveau dossier',
    addFolder: 'Ajouter dossier',
    folders: 'Dossiers',
    noFoldersYet: 'Aucun dossier pour l’instant.',
    backToFolders: 'Retour aux dossiers',
    notesInFolder: 'Notes dans "{{name}}"',
    selectFolder: 'Sélectionne un dossier',
    noteTitle: 'Titre de note',
    noteContent: 'Écris ta note',
    addNote: 'Ajouter une note',
    rename: 'Renommer',
    delete: 'Supprimer',
    editNote: 'Modifier la note',
    deleteNote: 'Supprimer la note',
    noNotesInFolder: 'Aucune note dans ce dossier.',
    english: 'Anglais',
    turkish: 'Turc',
    spanish: 'Espagnol',
    french: 'Français'
  }
};

export const translate = (
  language: LanguageOption,
  key: I18nKey,
  params?: Record<string, string | number>
): string => {
  const raw = messages[language]?.[key] ?? messages.en[key] ?? key;
  if (!params) {
    return raw;
  }

  return Object.entries(params).reduce(
    (result, [paramKey, value]) => result.split(`{{${paramKey}}}`).join(String(value)),
    raw
  );
};
