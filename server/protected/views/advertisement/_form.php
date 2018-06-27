<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'advertisement-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>
	<div class="form-group row">
		<?php echo $form->labelEx($model,'image', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo $form->textField($model,'image',array('value'=>$model->image, 'class'=>'form-control')); ?>
			</p>
		</div>
	</div>
	<div class="form-group row">
		<?php echo $form->labelEx($model,'url', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo $form->textField($model,'url',array('value'=>$model->url, 'class'=>'form-control')); ?>
			</p>
		</div>
	</div>
	<div class="form-group row">
		<?php echo $form->labelEx($model,'text', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo $form->textArea($model,'text',array('value'=>$model->text, 'class'=>'form-control')); ?>
			</p>
		</div>
	</div>
	<!--
	<div class="row">
		<?php //echo $form->labelEx($model,'priority'); ?>
		<?php //echo $form->textField($model,'priority'); ?>
	</div>
	-->
	<div class="form-group row">
		<label class='col-sm-2 form-control-label'></label>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save', array('class'=>'btn btn-inline', 'onclick'=>'return validate();', 'onsubmit'=>'return validate()')); ?>
			</p>
		</div>
	</div>

<?php $this->endWidget(); ?>