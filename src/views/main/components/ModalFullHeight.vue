<template>
    <div class="modal fade bd-example-modal-lg" id="modalFullHeight" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Evidencia</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <iframe></iframe>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['evidence'],
        watch: {
            evidence() {
                const original = document.getElementsByTagName("iframe")[0];
                const newFrame = document.createElement("iframe");
                newFrame.width = "100%"
                newFrame.height = "100%"
                newFrame.src = this.evidence + '#toolbar=1'
                newFrame.setAttribute('frameborder', 0)
                original.parentNode.replaceChild(newFrame, original);
            }
        },
    }
</script>

<style scoped>
.modal {
    padding: 0 !important
  }
  .modal .modal-dialog {
    
    
    height: 100%;
    margin: auto;
  }
  .modal .modal-content {
    height: 100%;
    border: 0;
    border-radius: 0;
  }
</style>