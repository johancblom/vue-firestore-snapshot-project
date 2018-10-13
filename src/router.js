import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import EditTenant from "@/components/EditTenant";
import NewTenant from "@/components/NewTenant";
import Tenants from "@/components/Tenants";
import Plots from "@/components/Plots";
import EditPlot from "@/components/EditPlot";
import NewPlot from "@/components/NewPlot";
import Signin from "@/components/Signin";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/edit-tenant/:tenant_id",
      name: "EditTenant",
      component: EditTenant
    },
    {
      path: "/new-tenant",
      name: "NewTenant",
      component: NewTenant
    },
    {
      path: "/tenants",
      name: "Tenants",
      component: Tenants
    },
    {
      path: "/plots",
      name: "Plots",
      component: Plots
    },
    {
      path: "/edit-plot/:plot_id",
      name: "EditPlot",
      component: EditPlot
    },
    {
      path: "/new-plot",
      name: "NewPlot",
      component: NewPlot
    },
    {
      path: "/signin",
      name: "Signin",
      component: Signin
    }
  ]
});
