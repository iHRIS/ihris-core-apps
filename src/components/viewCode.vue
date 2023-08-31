<template>
  <div class="code-container">
    <code-highlight class="code-block" language="javaScript">
      <pre>
        {{code}}
      </pre>
    </code-highlight>
  </div>
</template>

<script>
import CodeHighlight from "vue-code-highlight/src/CodeHighlight.vue";
import "vue-code-highlight/themes/duotone-sea.css";
import "vue-code-highlight/themes/window.css";
export default {
  name: "ViewCode",
  props:["code"],
  components: {
    CodeHighlight
  }
};
</script>

<style>
.code-container {
  height: 800px;
  overflow-y: scroll;
}

.code-block {
  max-height: 100%;
}

.code-block pre,
.code-block code {
  font-size: 18px; /* Set the font size for the pre and code elements */
  background-color: #3d4c5b;
  line-height: 1.5;
}
</style>
