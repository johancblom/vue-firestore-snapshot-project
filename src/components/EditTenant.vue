<template>
    <div class="edit-tenant container">
        <h2>Edit Tenant</h2>
        <form @submit.prevent="editTenant" v-if="tenant">
            <div class="field">
                <label for="last-name">Last Name</label>
                <input type="text" name="last-name" v-model="tenant.lastName">
            </div>
            <div v-for="(plot, index) in tenantPlots" class="field plot" :key="index">
                <label for="plot">Plot:</label>
                <input type="text" name="plot" :value="plot.id">
                <i class="material-icons delete" @click="deletePlot(plot.id)">delete</i>
            </div>
            <div v-for="(plot, index) in availablePlots" class="field plot" :key="index">
                <label for="plotToAdd">Plot to add:</label>
                <input type="text" name="plotToAdd" :value="plot.id">
                <i class="material-icons add" @click="addPlot(plot)">add</i>
            </div>
            <div class="red-text">{{feedback}}</div>
            <input type="submit" class="btn" value="Submit">
        </form>
    </div>
</template>
<script>
import db from '@/firebase/init'

export default {
    name: "EditTenant",
    data () {
        return {
            tenant: null,
            tenantPlots: [],
            tenantRef: null,
            feedback: null,
            availablePlots: []
        }
    },
    created() {
        this.tenantRef = db.collection('tenants').doc(this.$route.params.tenant_id);
                this.tenantRef.get().then(doc => {
                this.tenant = doc.data()
                db.collection('plots').where('tenant', '==', this.$route.params.tenant_id).get().then(plots => {
                    plots.forEach(plot => {
                    console.log("created: " + plot.id);
                    let thisPlot = {
                        id: plot.id
                    }
                    this.tenantPlots.push(thisPlot);
                })
            });
       });
        const nullTenantRef = db.collection('tenants').doc('nullTenant')
        
        db.collection('plots').where('tenant', '==', nullTenantRef).get().then(plots => {
            plots.forEach(plot => {
                console.log(plot.id) + '=>'+ plot.data();
                this.availablePlots.push(plot);
            })
        })

    },
    methods: {
        editTenant() {
            if (this.tenant.lastName) {
                this.feedback = 'last name supplied'
                this.tenantRef.set ({
                    lastName: this.tenant.lastName,
                    plots: this.tenant.plots
                }).then(doc => 
                    this.$router.push({name: 'home'}))
                .catch(err =>
                console.log(err))
                    this.feedback = null;
            } else {
                this.feedback = 'No last name supplied'
            }
        },
        deletePlot(thePlot){
            this.tenantPlots = this.tenantPlots.filter(plot => {
                console.log("plots id: " + plot.id, thePlot)
                console.log(plot.id != thePlot)
                return plot.id != thePlot
            })

        },
        addPlot(thePlot){
            console.log('addPlot' + thePlot.id);
            this.tenant.plots.push(thePlot);
            this.availablePlots = this.availablePlots.filter(plot => {
                return (plot.id != thePlot.id)
            })
        }
    }
}
</script>
<style>
.edit-tenant{

  margin-top: 60px;

  padding: 20px;

  max-width: 500px;

}

.edit-tenant h2{

  font-size: 2em;

  margin: 20px auto;

}

.edit-tenant .field{

  margin: 20px auto;

  position: relative;

}

.edit-tenant .delete, .add{

  position: absolute;

  right: 0;

  bottom: 16px;

  color: #aaa;

  font-size: 1.4em;

  cursor: pointer;

}
</style>