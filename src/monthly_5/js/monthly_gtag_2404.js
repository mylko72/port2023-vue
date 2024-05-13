
window.dataLayer = window.dataLayer || [];
function gtag(){
    dataLayer.push(arguments);
}
gtag('js', new Date());

document.querySelector('.monthly-wrap').addEventListener('click', (e) => {
    const current = e.target;
    const currentTarget = current.closest('[data-dynamic-param1]');

    if (currentTarget !== null) {
        const attributes = {};

        [...currentTarget.attributes].forEach((attr) => {
            const attrName = attr.name;
            attributes.event = "custom_event_microsite";
            if (attrName.includes('data-dynamic')) {
                const paramKey = attr.name.slice(-1);
                attributes[`dynamic_param${paramKey}`] = attr.value;
            }
        });

        dataLayer.push(attributes);
    }
});