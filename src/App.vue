<template>
    <div>
        <div>hello {{text}}</div>
        <div>number {{number}}</div>
    </div>
</template>

<script>
    export default {
        props: ['context'],
        data: function () {
            return {
                text: this.context.text,
                number: parseInt(this.context.number),
            }
        },
        mounted() {
            setInterval(() => {
                this.number = this.number + 1;
            }, 1000)
        }
    }
</script>