<template>
    <div>View Tenant
        <h2 v-if="tenant">{{tenant.lastName}}</h2>
        </div>
</template>
<script>
import db from '@/firebase/init'

export default {
    name: "ViewTenant",
    data () {
        return {
            tenant: null
        }
    },
    created() {
        let ref = db.collection('tenants').doc(this.$route.params.tenant_id);
        ref.get().then(doc => {
                console.log(doc.data())
                this.tenant = doc.data()
                this.tenant.id = doc.id
        });
    }
}
</script>
<style>
</style>