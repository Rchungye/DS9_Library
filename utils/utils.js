// Genera un hash numérico a partir de un string (para simular contraseñas encriptadas)
export function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // fuerza a 32 bits
    }
    return hash.toString();
}

// Si no hay sesión activa, redirige al login
export function validateSession() {
    const session = localStorage.getItem('sessionUser');
    if (session && session !== 'cerrado') return;

    window.location.href = '../login/login.html';
}

// Redirige según si hay sesión activa o no (inicio de la app)
export function validateInitialSession() {
    const session = localStorage.getItem('sessionUser');
    if (session && session !== 'cerrado') {
        window.location.href = './components/dashboard/dashboard.html';
        return;
    }

    window.location.href = './components/login/login.html';
}
