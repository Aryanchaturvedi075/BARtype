<script>
    import '../app.scss';
    import { onMount } from 'svelte';

    onMount(() => {
        // Initialize particles.js
        particlesJS.load('particles-js', 'particles.json', function() {
            console.log('particles.js loaded - callback');
        });
    });
</script>

<header
    class="bg-gray-800 p-4 text-white flex justify-between items-center border-b-2 border-gray-600"
>
    <div class="logo-container flex items-center">
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/54/BAR_Logo.png"
            alt="BARtype Logo"
            class="h-12 mr-2"
        />
        <h1 class="text-2xl font-bold text-yellow-500">BARtype</h1>
    </div>
    <div class="title-container text-center">
        <p class="text-gray-300">
            Challenge your speed and accuracy where every keystroke counts. Ready
            to beat your personal best?
        </p>
    </div>
    <div class="top-right-logo">
        <a href="#footer">
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ExGUTEwAQn95uM4KUU-OZ7Zz1n2lDrnXfw&s"
                alt="Footer Logo"
                class="h-12"
            />
        </a>
    </div>
</header>

<main class="p-6">
    <div id="particles-js"></div>
    <slot />
</main>

<footer id="footer" class="bg-gray-800 p-4 text-white text-center">
    <div class="author-githubs">
        <p class="text-gray-300">Developers:</p>
        <a
            href="https://github.com/GrizzlyToast"
            target="_blank"
            class="text-blue-400 hover:text-blue-300"
            >Rafi</a
        >
        <a
            href="https://github.com/baselAA33"
            target="_blank"
            class="text-blue-400 hover:text-blue-300"
            >Basel</a
        >
        <a
            href="https://github.com/Aryanchaturvedi075"
            target="_blank"
            class="text-blue-400 hover:text-blue-300"
            >Aryan</a
        >
    </div>
</footer>