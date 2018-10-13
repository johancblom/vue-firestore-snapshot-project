<template>
    <div class="edit-plot container">
        <h2>Edit Plot</h2>
        <form @submit.prevent="editPlot" v-if="plot">
            <div class="field">
                <label for="size">Size</label>
                <vue-slider v-bind="options" name="size" v-model="plot.size"></vue-slider>
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
  name: "Editplot",
  components: {
    vueSlider
  },
  data() {
    return {
      plot: null,
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
    this.plotRef = db.collection("plots").doc(this.$route.params.plot_id);
    this.plotRef.get().then(doc => {
      this.plot = doc.data();
      this.plot.id = doc.id;
    });
  },
  methods: {
    editPlot() {
      if (this.plot.size) {
        this.feedback = "size supplied";
        this.plotRef
          .update({
            size: this.plot.size
          })
          .then(doc => {
            this.$router.push({ name: "Plots" });
          })
          .catch(err => console.log(err));
        this.feedback = null;
      } else {
        this.feedback = "No last name supplied";
      }
    }
  }
};
</script>
<style>
.edit-plot {
  margin-top: 60px;

  padding: 20px;

  max-width: 500px;
}

.edit-plot h2 {
  font-size: 2em;

  margin: 20px auto;
}

.edit-plot .field {
  margin: 20px auto;

  position: relative;
}

.edit-plot .delete,
.add {
  position: absolute;

  right: 0;

  bottom: 16px;

  color: #aaa;

  font-size: 1.4em;

  cursor: pointer;
}
</style>