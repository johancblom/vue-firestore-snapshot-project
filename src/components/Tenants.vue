<template>
  <div class="tenants">
    <h1>This is the tenants page</h1>
    <ul>
        <li v-for="tenant in tenants" :key="tenant.id">
            <span>{{tenant.lastName}}</span>
        </li>
    </ul>
  </div>
</template>

<script>
import db from '@/firebase/init'
export default {
  name: 'tenants',
  data() {
      return {
          tenants: [],
          plots: []
      }
  },
  created() {
    db.collection('tenants').get().then( snapshot => {
          snapshot.forEach(doc => {
              let tenant = doc.data();
              tenant.id = doc.id;
              let plots = doc.data().plots;
              if (plots && plots.length > 0) {
                let i = 0;
                for (i = 0; i < plots.length; i++) {
                  plots[i].get().then(doc => {
                      console.log(doc.data());
                      doc.data().tenant.get().then(tenant => {
                        console.log(tenant.data().lastName);
                      })
                    })
                  }
              }
              this.tenants.push(tenant);
      })
    })
  }
}
</script>

<style>

</style>