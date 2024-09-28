document.addEventListener('DOMContentLoaded', () => {
    const group = document.querySelector('.group');
    for (let i = 1; i < 50; i++) {
        const containerId = `iconContainer${i}`;
        const container = document.createElement('div');
        container.className = 'iconContainer';
        container.id = containerId;
        group.appendChild(container);
        addIcons(containerId);
    }

    function addIcons(containerId) {
        const iconContainer = document.getElementById(containerId);
        const Unicode = [
            '⚡',
        ];

        for (let i = 0; i < 100; i++) {
            const icon = document.createElement('i');
            icon.className = 'icon fas';
            icon.innerHTML = randomIcon(Unicode);
            iconContainer.appendChild(icon);
        }

        function randomIcon(values) {
            const randomIndex = Math.floor(Math.random() * values.length);
            return values[randomIndex];
        }
    }
    // Ensure the button is clickable
    const startButton = document.querySelector('.startButton');
    if (startButton) {
        startButton.style.position = 'relative';
        startButton.style.zIndex = '1000';
    }
});

