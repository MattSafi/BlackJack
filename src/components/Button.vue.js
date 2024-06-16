export default (await import('vue')).defineComponent({
    name: 'Button',
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    }
});
;
function __VLS_template() {
    let __VLS_ctx;
    /* Components */
    let __VLS_otherComponents;
    let __VLS_own;
    let __VLS_localComponents;
    let __VLS_components;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (...[$event]) => {
                __VLS_ctx.$emit('click');
                // @ts-ignore
                [$emit,];
            } }, });
    var __VLS_0 = {};
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    const __VLS_name = 'Button';
    let __VLS_internalComponent;
}
//# sourceMappingURL=Button.vue.js.map