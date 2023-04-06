<script lang="ts">
  let power: number = 50
</script>

<main id="container">
  <div id="content">
    <h1>Мощность:</h1>
    <h2>{power}%</h2>
    <div id="slider-container">
      <input type="range" min="1" max="100" bind:value={power} class="slider" id="myRange" />
    </div>
  </div>
</main>

<style scoped>
  * {
    margin: 0;
  }

  h1 {
    text-transform: capitalize;
    font-weight: 700;
  }

  h2 {
    font-size: 50px;
  }

  #container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #slider-container {
    width: 100%;
  }

  .slider {
    width: 100%; /* Full-width */
    height: 25px; /* Specified height */
    -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
    transition: opacity 0.2s;
  }
</style>
