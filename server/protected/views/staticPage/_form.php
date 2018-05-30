
<script>
	function validate(){
		if($('#StaticPage_title_en').val()==""){
			alert('Please enter Page Title (English)');
			return false;
		}
		if($('#StaticPage_heading_en').val()==""){
			alert('Please enter Page Heading (English)');
			return false;
		}
		if($('#StaticPage_title_pl').val()==""){
			alert('Please enter Page Title (Polish)');
			return false;
		}
		if($('#StaticPage_heading_pl').val()==""){
			alert('Please enter Page Heading (Polish)');
			return false;
		}
		if(CKEDITOR.instances.StaticPage_body_en.getData()==""){
			alert('Please enter Page Body(English)');
			return false;
		}
		if(CKEDITOR.instances.StaticPage_body_pl.getData()==""){
			alert('Please enter Page Body(Polish)');
			return false;
		}
		updateData();
		return true;
	}
	function updateData(){
		$('#body-en').val(CKEDITOR.instances.StaticPage_body_en.getData());
		$('#body-pl').val(CKEDITOR.instances.StaticPage_body_pl.getData());
	}
</script>

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'static-page-form',
	'enableAjaxValidation'=>false,
)); ?>

	<div class="form-group row">
		<?php echo $form->labelEx($model,'title_en', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo $form->textField($model,'title_en',array('size'=>60,'maxlength'=>100, 'value'=>$model->title_en, 'class'=>'form-control')); ?>
			</p>
		</div>
	</div>
	<div class="form-group row">
		<?php echo $form->labelEx($model,'title_pl', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo $form->textField($model,'title_pl',array('size'=>60,'maxlength'=>100, 'value'=>$model->title_pl, 'class'=>'form-control')); ?>
			</p>
		</div>
	</div>
	<div class="form-group row">
		<?php echo $form->labelEx($model,'heading_en', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo $form->textField($model,'heading_en',array('size'=>60,'maxlength'=>100, 'value'=>$model->heading_en, 'class'=>'form-control')); ?>
			</p>
		</div>
	</div>
	<div class="form-group row">
		<?php echo $form->labelEx($model,'heading_pl', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo $form->textField($model,'heading_pl',array('size'=>60,'maxlength'=>100, 'value'=>$model->heading_pl, 'class'=>'form-control')); ?>
			</p>
		</div>
	</div>
	<div class="form-group row">
		<?php echo $form->labelEx($model,'body_en', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
			<?php $this->widget('application.extensions.ckeditor.CKEditor', array(
				'model'=>$model,
				'attribute'=>'body_en',
				'editorTemplate'=>'full',
				)); ?>
			</p>
		</div>
	</div>
	<div class="form-group row">
		<?php echo $form->labelEx($model,'body_pl', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php $this->widget('application.extensions.ckeditor.CKEditor', array(
				'model'=>$model,
				'attribute'=>'body_pl',
				'editorTemplate'=>'full',
				)); ?>
			</p>
		</div>
	</div>
	<input type="hidden" name="StaticPage[body_en]" id="body-en"/>
	<input type="hidden" name="StaticPage[body_pl]" id="body-pl"/>
	<div class="form-group row">
		<label class='col-sm-2 form-control-label'></label>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save', array('class'=>'btn btn-inline', 'onclick'=>'return validate();', 'onsubmit'=>'return validate()')); ?>
			</p>
		</div>
	</div>
<?php $this->endWidget(); ?>
<script>
	CKEDITOR.on('instanceReady', function() { 
		CKEDITOR.document.getById('cke_3').$.style.display = 'none';
		CKEDITOR.document.getById('cke_9').$.style.display = 'none';
		CKEDITOR.document.getById('cke_18').$.style.display = 'none';
		CKEDITOR.document.getById('cke_25').$.style.display = 'none';
		CKEDITOR.document.getById('cke_54').$.style.display = 'none';
		CKEDITOR.document.getById('cke_58').$.style.display = 'none';
		CKEDITOR.document.getById('cke_72').$.style.display = 'none';
		CKEDITOR.document.getById('cke_75').$.style.display = 'none';

		CKEDITOR.document.getById('cke_83').$.style.display = 'none';
		CKEDITOR.document.getById('cke_89').$.style.display = 'none';
		CKEDITOR.document.getById('cke_98').$.style.display = 'none';
		CKEDITOR.document.getById('cke_105').$.style.display = 'none';
		CKEDITOR.document.getById('cke_134').$.style.display = 'none';
		CKEDITOR.document.getById('cke_138').$.style.display = 'none';
		CKEDITOR.document.getById('cke_152').$.style.display = 'none';
		CKEDITOR.document.getById('cke_155').$.style.display = 'none';
	});
</script>