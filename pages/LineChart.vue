<script>
import { Line as LineChartGenerator } from "vue-chartjs";

export default {
  extends: LineChartGenerator,
  props: ["data", "options"],
  mounted() {
    this.renderChart(this.data, this.options);
  },
};
</script>
