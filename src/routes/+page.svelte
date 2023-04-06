<script>
  import Power from '$lib/power.client.svelte'
</script>

<div id="content">
  <h1>Мощность:</h1>
  <Power />
</div>

<style>
  * {
    font-family: Roboto, sans-serif;
    margin: 0;
  }

  h1 {
    text-transform: capitalize;
    font-weight: 600;
  }

  #content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
