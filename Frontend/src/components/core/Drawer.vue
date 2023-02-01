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
      :src="require('../../image/snow.jpeg')"
      mobile-breakpoint="960"
      app
      width="260"
      v-bind="$route"
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
            @click="changeColor(item)"
            :key="item.title"
            :prepend-icon="item.icon"
            :append-icon="
              item.expanded ? 'mdi-chevron-down' : 'mdi-chevron-down'
            "
          >
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title
                  v-if="item.mau === true"
                  style="color: red; font-weight: 600"
                >
                  {{ item.title }}
                </v-list-item-title>
                <v-list-item-title v-else>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              v-for="(child, i) in item.childs"
              :key="i"
              :to="child.to"
              @click="changeColor(item)"
              active-class="border"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon color="blue" class="pl-3">{{ child.icon }}</v-icon>
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
    <!-- info dialog -->
    <info-dialog
      :show="infoDialog.show"
      @close-dialog="infoDialog.show = false"
      @load-screen="loadScreen"
    />
  </nav>
</template>

<script>
// Utilities
import router from "@/router";

import { mapState } from "vuex";
import Header from "./AppBar.vue";
import InfoDialog from "../../views/Login/Login.vue";

export default {
  components: {
    Header,
    InfoDialog,
  },
  name: "DashboardCoreDrawer",
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    computedItems: [],
    infoDialog: {
      show: false,
    },
    items: [
      //TEAMPLATE
      {
        icon: "mdi-view-dashboard",
        title: "menu_template_title",
        expanded: false,
        id: 1,
        childs: [
          {
            icon: "mdi-view-dashboard",
            title: "menu_template_dashboard",
            to: "/trangchu",
          },
          {
            icon: "mdi-account",
            title: "menu_template_user",
            to: "/pages/user",
          },
          {
            title: "menu_template_table",
            icon: "mdi-clipboard-outline",
            to: "/tables/regular-tables",
          },
          {
            title: "menu_template_typography",
            icon: "mdi-format-font",
            to: "/components/typography",
          },
          {
            title: "menu_template_icon",
            icon: "mdi-chart-bubble",
            to: "/components/icons",
          },
          {
            title: "menu_template_google",
            icon: "mdi-map-marker",
            to: "/maps/google-maps",
          },
          {
            title: "menu_template_notifications",
            icon: "mdi-bell",
            to: "/components/notifications",
          },
        ],
      },

      //DEMO  23/11/2022
      {
        icon: "mdi-account-box-multiple-outline",
        title: "menu_demo_title",
        expanded: false,
        id: 2,
        childs: [
          {
            title: "menu_demo_create_api_title",
            icon: "mdi-book-open-page-variant-outline",
            to: "/demo1",
          },
        ],
      },

      //MANAGE
      {
        icon: "mdi-application-cog-outline",
        title: "menu_manage_title",
        expanded: false,
        id: 3,
        childs: [
          {
            title: "menu_manage_teamplate_demo_title",
            icon: "mdi-book-open-page-variant-outline",
            to: "/manage/demo",
          },
          //chi nhánh
          {
            title: "manu_manage_branch_title",
            icon: "mdi-home-edit-outline",
            to: "/manage/branch",
          },
          //loại nhân viên 30/11/2022
          {
            title: "menu_manage_pertment_position_title",
            icon: "mdi-account-cog-outline",
            to: "/manage/department_position",
          },
          //nhân viên 30/11/2022
          {
            title: "menu_manage_staff_title",
            icon: "mdi-account-star-outline",
            to: "/manage/staff",
          },
          //loại dịch vụ
          {
            title: "menu_manage_service_title",
            icon: "mdi-account-wrench",
            to: "/manage/type_service",
          },
          //loại sản phẩm
          {
            title: "menu_manage_type_product_title",
            icon: "mdi-bird",
            to: "/manage/type_product",
          },
          //sản phẩm
          {
            title: "menu_manage_product_title",
            icon: "mdi-cart-heart",
            to: "/manage/product",
          },
        ],
      },
    ],
  }),

  computed: {
    ...mapState(["barColor"]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
    profile() {
      return {
        avatar: true,
        title: this.$t("avatar"),
      };
    },
  },

  mounted: async function () {
    await this.openInfoDialog();
    if (localStorage.status_login_id == 600) {
      this.loadScreen();
    }
  },

  methods: {
    //
    openInfoDialog: function () {
      if (localStorage.status_login_id != 600) {
        this.infoDialog = { show: true };
      }
    },

    changeColor(item) {
      for (let i = 0; i < this.computedItems.length; i++) {
        this.computedItems[i].mau = false;
        if (item.id === this.computedItems[i].id) {
          this.computedItems[i].mau = true;
        }
      }
    },

    loadScreen() {
      this.computedItems = this.items.map(this.mapItem);
    },
    mapItem(item) {
      return {
        ...item,
        childs: item.childs ? item.childs.map(this.mapItem) : undefined,
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
