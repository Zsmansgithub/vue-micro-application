<template>
  <div class="divstyle scrollstyle">
    <canvas width="450px" height="450px" id="chessboard"></canvas>
  </div>
</template>

<script>
  export default {
    created() {

    }
  };
</script>

<style>
  #chessboard {
    margin: 50px auto;
    display: block;
    background-color: red;
    box-shadow: -2px -2px 1px #efefef, 5px 5px 5px #b9b9b9;
  }

</style>
