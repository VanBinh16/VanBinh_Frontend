<template>
  <nav>
    <v-app-bar app dark color="blue" flat height="65">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="thidden-sm-and-down font-weight-light">
        <span>{{ $route.name }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <Header />
    </v-app-bar>

    <v-navigation-drawer
      fixed
      id="core-navigation-drawer"
      v-model="drawer"
      :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
      :expand-on-hover="expandOnHover"
      :right="$vuetify.rtl"
      :src="barImage"
      mobile-breakpoint="960"
      app
      width="260"
      v-bind="$attrs"
    >
      <template v-slot:img="props">
        <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
      </template>

      <v-divider class="mb-1" />
      <v-list dense nav>
        <v-list-item>
          <v-list-item-avatar class="align-self-center" color="white" contain>
            <v-img
              src="https://demos.creative-tim.com/vuetify-material-dashboard/favicon.ico"
              max-height="30"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="display-2" v-text="profile.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider class="mb-2" />
      <v-list dense>
        <template v-for="(item, idx) in computedItems">
          <v-list-group
            v-if="item.childs"
            v-model="item.expanded"
            :key="item.title"
            :prepend-icon="item.icon"
            :append-icon="
              item.expanded ? 'mdi-chevron-down' : 'mdi-chevron-down'
            "
          >
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title class="white--text">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              v-for="(child, i) in item.childs"
              :key="i"
              :to="child.to"
              active-class="border"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon color="blue" class="pl-3">{{
                  child.icon
                }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="white--text">
                  {{ child.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-item v-else :to="item.to" :key="idx">
            <v-list-item-action>
              <v-icon class="white--text">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="demo">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>

      <template v-slot:append>
        <base-item
          :item="{
            title: $t('upgrade'),
            icon: 'mdi-package-up',
            to: '/upgrade',
          }"
        />
      </template>
    </v-navigation-drawer>
  </nav>
</template>

<script>
// Utilities
import { mapState } from "vuex";
import Header from "./AppBar.vue";

export default {
  components: {
    Header,
  },
  name: "DashboardCoreDrawer",

  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    items: [
      //teamplate
      {
        icon: "mdi-view-dashboard",
        title: "teamplate",
        expanded: false,
        childs: [
          {
            icon: "mdi-view-dashboard",
            title: "dashboard",
            to: "/",
          },
          {
            icon: "mdi-account",
            title: "user",
            to: "/pages/user",
          },
          {
            title: "rtables",
            icon: "mdi-clipboard-outline",
            to: "/tables/regular-tables",
          },
          {
            title: "typography",
            icon: "mdi-format-font",
            to: "/components/typography",
          },
          {
            title: "icons",
            icon: "mdi-chart-bubble",
            to: "/components/icons",
          },
          {
            title: "google",
            icon: "mdi-map-marker",
            to: "/maps/google-maps",
          },
          {
            title: "notifications",
            icon: "mdi-bell",
            to: "/components/notifications",
          },
        ],
      },
      //demo create 23/11/2022
      {
        icon: "mdi-application-cog-outline",
        title: "demo",
        expanded: false,
        childs: [
          {
            title: "teamplate demo concect api",
            icon: "mdi-book-open-page-variant-outline",
            to: "/demo1",
          },
        ],
      },

      //MANAGE
      {
        icon: "mdi-application-cog-outline",
        title: "quan_ly",
        expanded: false,
        childs: [
          {
            title: "teamplate quản lý",
            icon: "mdi-book-open-page-variant-outline",
            to: "/manage/demo",
          },
        ],
      },
    ],
  }),

  computed: {
    ...mapState(["barColor", "barImage"]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
    computedItems() {
      return this.items.map(this.mapItem);
    },
    profile() {
      return {
        avatar: true,
        title: this.$t("avatar"),
      };
    },
  },

  methods: {
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title),
      };
    },
  },
};
</script>

<style scoped>
.border {
  border-left: 4px solid #0ba518;
}
.demo {
  color: red;
}
</style>
