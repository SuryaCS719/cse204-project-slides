document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentSlideEl = document.getElementById('current-slide');
    const totalSlidesEl = document.getElementById('total-slides');
    const progressBar = document.getElementById('progress-bar');

    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    // Initialize
    totalSlidesEl.textContent = totalSlides;
    updateSlideState();
    generateGrid();
    generateHaltingGrid();
    setupInteractiveDiagonal();

    // Navigation
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;

        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = index;
        slides[currentSlideIndex].classList.add('active');

        updateSlideState();
    }

    function updateSlideState() {
        // Update UI
        currentSlideEl.textContent = currentSlideIndex + 1;
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === totalSlides - 1;

        // Update Progress Bar
        const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            goToSlide(currentSlideIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            goToSlide(currentSlideIndex - 1);
        }
    });

    // --- Content Generation ---

    // Slide 4: The Grid
    function generateGrid() {
        const gridContainer = document.getElementById('diagonal-grid');
        if (!gridContainer) return;

        // Example numbers (binary expansions)
        const numbers = [
            ['0', '1', '0', '1', '1'],
            ['1', '0', '1', '0', '0'],
            ['0', '0', '1', '1', '0'],
            ['1', '1', '0', '0', '1'],
            ['0', '1', '1', '0', '0']
        ];

        gridContainer.innerHTML = '';

        numbers.forEach((row, rowIndex) => {
            // Label
            const label = document.createElement('div');
            label.className = 'grid-label';
            label.textContent = `n${rowIndex + 1}: 0.`;
            gridContainer.appendChild(label);

            // Bits
            row.forEach((bit, colIndex) => {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = bit;

                if (rowIndex === colIndex) {
                    cell.classList.add('diagonal');
                }

                gridContainer.appendChild(cell);
            });

            // Ellipsis
            const ellipsis = document.createElement('div');
            ellipsis.className = 'grid-cell';
            ellipsis.style.background = 'transparent';
            ellipsis.textContent = '...';
            gridContainer.appendChild(ellipsis);
        });
    }

    // Slide 5: Interactive Diagonal
    function setupInteractiveDiagonal() {
        const container = document.getElementById('interactive-diagonal');
        const display = document.getElementById('new-number-display');
        if (!container) return;

        // The diagonal bits from our example above: 0, 0, 1, 0, 0
        const diagonalBits = ['0', '0', '1', '0', '0'];
        const newBits = [null, null, null, null, null]; // Start undefined

        container.innerHTML = '';

        diagonalBits.forEach((bit, index) => {
            const btn = document.createElement('button');
            btn.className = 'bit-btn';
            btn.textContent = bit;
            btn.title = "Click to flip";

            btn.addEventListener('click', () => {
                // Flip logic
                const currentVal = btn.textContent;
                const newVal = currentVal === '0' ? '1' : '0';

                btn.textContent = newVal;
                btn.classList.add('flipped');

                newBits[index] = newVal;
                updateNewNumberDisplay(newBits, display);
            });

            container.appendChild(btn);
        });
    }

    function updateNewNumberDisplay(bits, displayElement) {
        const text = bits.map(b => b === null ? '_' : b).join('');
        displayElement.textContent = `0.${text}...`;
    }

    // Slide 9: Halting Grid
    function generateHaltingGrid() {
        const gridContainer = document.getElementById('halting-grid');
        if (!gridContainer) return;

        // 1 = Halt, 0 = Loop
        const behaviors = [
            ['1', '0', '1', '1', '0'],
            ['0', '1', '0', '0', '1'],
            ['1', '1', '1', '0', '0'],
            ['0', '0', '1', '0', '1'],
            ['1', '0', '0', '1', '1']
        ];

        gridContainer.innerHTML = '';

        // --- Header Row (w1, w2...) ---
        // Empty corner cell
        gridContainer.appendChild(document.createElement('div'));

        // Column headers
        for (let i = 0; i < 5; i++) {
            const header = document.createElement('div');
            header.className = 'grid-label';
            header.style.textAlign = 'center';
            header.style.paddingBottom = '0.5rem';
            header.textContent = `w${i + 1}`;
            gridContainer.appendChild(header);
        }
        // Ellipsis header
        gridContainer.appendChild(document.createElement('div'));

        // --- Data Rows ---
        behaviors.forEach((row, rowIndex) => {
            // Label (M1, M2...)
            const label = document.createElement('div');
            label.className = 'grid-label';
            label.textContent = `M${rowIndex + 1}`;
            gridContainer.appendChild(label);

            // Bits
            row.forEach((bit, colIndex) => {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = bit === '1' ? 'H' : 'L';
                cell.style.color = bit === '1' ? 'var(--accent-color)' : 'var(--error-color)';

                if (rowIndex === colIndex) {
                    cell.style.border = '2px solid var(--accent-secondary)';
                    cell.style.boxShadow = '0 0 10px rgba(189, 147, 249, 0.2)';
                }

                gridContainer.appendChild(cell);
            });
            // Ellipsis
            const ellipsis = document.createElement('div');
            ellipsis.className = 'grid-cell';
            ellipsis.style.background = 'transparent';
            ellipsis.textContent = '...';
            gridContainer.appendChild(ellipsis);
        });
    }
});
