<script setup>
import SelectForm from './components/SelectForm.vue';
import { CFooter} from '@coreui/vue';
</script>

<template>
  <div class="min-vh-100">
    <BNavbar>
      <BNavbarBrand href="">InteractiveImagesGenerator</BNavbarBrand>
      <a href="https://github.com/Mamatankane-Future/IIG" class="text-reset"><IRaphaelgithub class="h1 mt-2 mr-2"/></a>
    </BNavbar>
    <div class="container">
      <h2>How does it work?</h2>
      <p>Use our intuitive SVG generator for creating interactive images with ease. Start by selecting an image from your computer, then effortlessly generate interactive areas using rectangle, circle, or polygon shapes. Simply point and click on your image to define these areas. Once you've finished, click on "Show code" to reveal the generated code in either HTML, Vue, or React format. Shortcuts: 'Ctr+v' to copy and paste the selected object. 'Delete' to delete the selected object.😉</p>
    </div>
    <div class="container">
      <SelectForm />
    </div>

    <div class="container mt-5">
      <h2>Final remarks</h2>
      <p>We hope you find our SVG generator helpful for your projects! If you appreciate the tool and the effort put into its development, please consider showing your support by giving a star⭐ to the project on GitHub. Your feedback and encouragement are invaluable to us. Thank you for using our SVG generator!🚀</p>
    </div>
    
  </div>

  <CFooter class="mt-5 d-flex justify-content-center">
    <span>Copyright © InteractiveImageGenerator 2024</span>
  </CFooter>
</template>

<style scoped>
  .nav{
    display: flex;
    justify-content: space-between;
    color: #000;
  }


</style>