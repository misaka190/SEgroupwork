import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'workspace',
      component: () => import('@/pages/DiagnosticWorkspace.vue'),
    },
    {
      path: '/patients',
      name: 'patients',
      component: () => import('@/pages/PatientList.vue'),
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('@/pages/ReportEditor.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/SystemSettings.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/pages/HelpDocs.vue'),
    },
  ],
})

export default router
