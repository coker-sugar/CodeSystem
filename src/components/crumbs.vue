<template>
  <div class="breadcrumb">
    <ul>
      <li v-for="(route, index) in routes" :key="route.path">
        <router-link :to="route.path">{{ route.meta.title }}</router-link>
        <span v-if="index !== routes.length - 1">/</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    routes: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
