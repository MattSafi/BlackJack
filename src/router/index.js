import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import GameBoard from '../components/GameBoard.vue';
const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'About',
        component: AboutView
    },
    {
        path: '/game',
        name: 'GameBoard',
        component: GameBoard
    }
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});
export default router;
//# sourceMappingURL=index.js.map