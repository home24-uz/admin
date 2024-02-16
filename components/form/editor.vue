<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
/**
 * Form Quill Editor component
 */
export default {
  props: ["editorClass", "editorValue"],
  data() {
    return {
      text: this.editorValue,
      title: "Quill Editor",
      items: [
        {
          text: "Minton",
          href: "/",
        },
        {
          text: "Forms",
          href: "/",
        },
        {
          text: "Quill Editor",
          active: true,
        },
      ],
      editorOption: {
        // Some Quill options...
        theme: "snow",
        modules: {
          toolbar: [
            [
              {
                size: [],
              },
            ],
            ["bold", "italic", "underline", "strike"],

            ["image"],
            ["code-block"],
          ],
        },
      },
      option: {
        theme: "bubble",
        modules: {
          toolbar: [
            ["bold", "italic", "link"],
            [
              {
                header: 1,
              },
              {
                header: 2,
              },
              "blockquote",
            ],
          ],
        },
      },
    };
  },
  // middleware: "router-auth",
  components: { quillEditor },
};
</script>
<template>
  <div :class="editorClass">
    {{ editorValue }}
    <quill-editor
      style="min-height: 250px;"
      :options="editorOption"
      :value="editorValue"
      v-model="editorValue"
    />
    {{ editorValue }}
  </div>
</template>
