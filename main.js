import { validateInitialSession } from './src/utils/utils.js';

// Inicia la app validando si hay sesión activa (redirección automática)
(() => {
    const App = {
        init() {
            validateInitialSession();
        }
    };

    App.init();
})();