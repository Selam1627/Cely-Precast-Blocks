<script setup lang="ts">
import AudiencesSection from '@/components/sections/AudiencesSection.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ProductsSection from '@/components/sections/ProductsSection.vue'
import RoadmapSection from '@/components/sections/RoadmapSection.vue'
import SolutionSection from '@/components/sections/SolutionSection.vue'
import TeamSection from '@/components/sections/TeamSection.vue'
</script>

<template>
  <main class="min-h-screen bg-white">
    <HeroSection />
    <SolutionSection />
    <ProductsSection />
    <AudiencesSection />
    <RoadmapSection />
    <TeamSection />
  </main>
</template>
