<template>
  <div id="app">
    <Navbar />
    <router-view/>
  </div>
</template>

<script>
  import Navbar from '@/components/layout/Navbar'
  export default {
    name: 'App',
    components: {
      Navbar
    }
  };
</script>

<style>
  * i {
    font-family: 'Material Icons';
  }
  body{
    background: #eee;
  }
  .my-container {
      max-width: 900px;
  }

  .my-container .card{
    padding: 20px;
    margin-top: 60px;
  }
  .my-container h2{
    font-size: 2em;
    margin-top: 0;
  }
  .my-container li{
    padding: 10px;
    border-bottom: 1px solid #eee
  }
  .margin10 {
    margin: 10px;
  }
</style>
