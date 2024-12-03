<script>
    import '../app.scss';
  </script>
  
  <div class="app-container">
    <main>
      <slot />
    </main>
  </div>
  
  <style lang="scss">
    .app-container {
      @apply min-h-screen bg-gray-50;
    }
  
    main {
      @apply container mx-auto py-8;
    }
  </style>