<template>
    <div>Edit Tenant
        <form @submit.prevent="editTenant" v-if="tenant">
            <label for="last-name">Last Name</label>
            <input type="text" name="last-name" v-model="lastName">
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
            lastName: null,
            ref: null
        }
    },
    created() {
        this.ref = db.collection('tenants').doc(this.$route.params.tenant_id);
        this.ref.get().then(doc => {
                console.log(doc.data())
                this.tenant = doc.data()
                this.lastName = doc.data().lastName
                this.tenant.id = doc.id
        });
    },
    methods: {
        editTenant() {
            if (this.lastName) {
                this.ref.set ({
                    lastName: this.lastName
                }).then(doc => 
                    console.log(doc))
            }
        }
    }
}
</script>
<style>
</style>