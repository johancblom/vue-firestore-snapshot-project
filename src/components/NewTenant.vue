<template>
    <div class="new-tenant container">
        <h2>New Tenant</h2>
        <form @submit.prevent="newTenant">
            <div class="field">
                <label for="first-name">First Name</label>
                <input type="text" name="first-name" v-model="firstName">
            </div>
            <div class="field">
                <label for="last-name">Last Name</label>
                <input type="text" name="last-name" v-model="lastName">
            </div>
            <div v-for="(plot) in tenantPlots" class="field plot" :key="plot.id">
                <label for="plot">Plot: (size: {{plot.size}})</label>
                <input type="text" name="plot" :value="plot.id">
                <i class="material-icons delete" @click="deletePlot(plot)">delete</i>
            </div>
            <div v-for="(plot) in availablePlots" class="field plot" :key="plot.id">
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
    name: "NewTenant",
    data () {
        return {
            firstName: '',
            lastName: '',
            tenantref: null,
            plotRef: null,
            tenantPlots: [],
            feedback: null,
            availablePlots: []
        }
    },
    created() {
        this.tenantRef = db.collection('tenants')
        this.plotRef = db.collection('plots')
        this.plotRef.where('tenant', '==', "nobody").get().then(plots => {
            plots.forEach(plot => {
                this.availablePlots.push(plot);
            })
        })

    },
    methods: {
        newTenant() {
            console.log("in newTenant: " + this.lastName)
            if (this.lastName && this.lastName > '') {
                console.log(this.lastName)
                this.tenantRef.add ({
                    firstName: this.firstName,
                    lastName: this.lastName,
                }).then(doc => {
                    console.log(doc)
                    this.availablePlots.filter(plot => plot.changed ? db.doc(`plots/${plot.id}`).set({tenant: "nobody"}): null)
                    this.tenantPlots.forEach(plot => db.doc(`plots/${plot.id}`).set({tenant: doc.id}))
                    this.$router.push({name: 'home'})
                })
                .catch(err => {
                    console.log(err)
                    this.feedback = null;
                })
        } else {
            this.feedback = 'No last name supplied'
        }
        },
        deletePlot(thePlot){
            this.tenantPlots = this.tenantPlots.filter(plot => {
                console.log("plots id: " + plot.id, thePlot)
                console.log(plot.id != thePlot)
                return plot.id != thePlot.id
            })
            thePlot.changed = true
            this.availablePlots = [...this.availablePlots, thePlot]

        },
        addPlot(thePlot){
            console.log('addPlot' + thePlot.id);
            this.tenantPlots.push(thePlot);
            this.availablePlots = this.availablePlots.filter(plot => {
                return (plot.id != thePlot.id)
            })
        }
    }
}
</script>
<style>
.new-tenant{

  margin-top: 60px;

  padding: 20px;

  max-width: 500px;

}

.new-tenant h2{

  font-size: 2em;

  margin: 20px auto;

}

.new-tenant .field{

  margin: 20px auto;

  position: relative;

}

.new-tenant .delete, .add{

  position: absolute;

  right: 0;

  bottom: 16px;

  color: #aaa;

  font-size: 1.4em;

  cursor: pointer;

}
</style>