function renderHome() {
    const app = document.getElementById('app');
    if (!app) return;
    siteData.forEach(folder => {
        const card = document.createElement('div');
        card.className = 'folder-card';
        card.onclick = () => window.location.href = `list.html?folder=${encodeURIComponent(folder.folderName)}`;
        
        let recentHtml = '';
        const recentFiles = folder.files.slice(0, 3);
        recentFiles.forEach(file => {
            recentHtml += `<div class="recent-item" title="${file.name}">Doc: ${file.name}</div>`;
        });

        card.innerHTML = `
            <div class="folder-title">
                <span>Folder: ${folder.folderName}</span>
                <span style="font-size:1rem; color:var(--text-sub)">Total ${folder.files.length} files -></span>
            </div>
            <div class="recent-files">${recentHtml}</div>
        `;
        app.appendChild(card);
    });
}

let currentFolderFiles = [];
let renderedCount = 0;
const BATCH_SIZE = 12;

function renderList() {
    const urlParams = new URLSearchParams(window.location.search);
    const folderName = urlParams.get('folder');
    if (!folderName) { window.location.href = 'index.html'; return; }
    
    document.getElementById('folder-title').innerText = folderName;
    
    const folderData = siteData.find(f => f.folderName === folderName);
    if (!folderData) return;
    
    currentFolderFiles = folderData.files;
    const grid = document.getElementById('grid');
    
    loadMoreItems(grid);

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            loadMoreItems(grid);
        }
        const btn = document.getElementById('backToTop');
        if (btn) btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
}

function loadMoreItems(grid) {
    if (renderedCount >= currentFolderFiles.length) return;
    
    const fragment = document.createDocumentFragment();
    const end = Math.min(renderedCount + BATCH_SIZE, currentFolderFiles.length);
    
    for (let i = renderedCount; i < end; i++) {
        const file = currentFolderFiles[i];
        const card = document.createElement('div');
        card.className = 'html-card';
        card.onclick = () => window.location.href = `viewer.html?file=${encodeURIComponent(file.path)}&name=${encodeURIComponent(file.name)}`;
        card.innerHTML = `
            <div class="icon">HTML</div>
            <div class="name">${file.name}</div>
            <div class="time">Modified: ${file.mtime}</div>
        `;
        fragment.appendChild(card);
    }
    
    grid.appendChild(fragment);
    renderedCount = end;
}

function renderViewer() {
    const urlParams = new URLSearchParams(window.location.search);
    const filePath = urlParams.get('file');
    const fileName = urlParams.get('name');
    
    if (!filePath) { window.location.href = 'index.html'; return; }
    
    document.getElementById('file-name').innerText = fileName;
    document.getElementById('viewer-frame').src = filePath;
    document.getElementById('download-btn').href = filePath;
    document.getElementById('download-btn').download = fileName;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onload = () => {
    if (document.getElementById('app')) renderHome();
    else if (document.getElementById('list-app')) renderList();
    else if (document.getElementById('viewer-app')) renderViewer();
};