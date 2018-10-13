<template>
    <div class="new-plot container">
        <h2>New Plot</h2>
        <form @submit.prevent="newPlot">
            <div class="field">
                <label for="no">Plot No.</label>
                <input type="text" name="no" v-model="id">
            </div>
            <div class="field">
                <label for="size">Size</label>
                <vue-slider v-bind="options" name="size" v-model="size"></vue-slider>
            </div>
            <div class="red-text">{{feedback}}</div>
            <router-link :to="{name: 'Plots'}" class="left btn yellow darken-4" value="Cancel">Cancel</router-link>
            <input type="submit" class="btn right" value="Submit">
        </form>
    </div>
</template>
<script>
import db from "@/firebase/init";
import vueSlider from "vue-slider-component";
export default {
  name: "NewPlot",
  components: {
    vueSlider
  },
  data() {
    return {
      id: null,
      size: 1,
      plotRef: null,
      feedback: null,
      options: {
        min: 1,
        max: 5,
        interval: 0.5
      }
    };
  },
  created() {
    this.plotRef = db.collection("plots");
  },
  methods: {
    newPlot() {
      if (this.id && this.size) {
        this.plotRef
          .doc(this.id)
          .set({
            size: this.size,
            tenant: "nobody"
          })
          .then(doc => {
            this.$router.push({ name: "Plots" });
          })
          .catch(err => {
            console.log(err);
            this.feedback = null;
          });
      } else {
        this.feedback = "No size supplied";
      }
    }
  }
};
</script>
<style>
.new-plot {
  margin-top: 60px;

  padding: 20px;

  max-width: 500px;
}

.new-plot h2 {
  font-size: 2em;

  margin: 20px auto;
}

.new-plot .field {
  margin: 20px auto;

  position: relative;
}

.new-plot .delete,
.add {
  position: absolute;

  right: 0;

  bottom: 16px;

  color: #aaa;

  font-size: 1.4em;

  cursor: pointer;
}
</style>