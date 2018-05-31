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
		return true;
	}

	function onTypeSelect(){
		var typeSelectBox = document.getElementById('FooterMenu_type'),
			type = typeSelectBox.options[typeSelectBox.selectedIndex].value,
			staticPageContainer = document.getElementById('static-page-container'),
			customRouteContainer = document.getElementById('custom-route-container'),
			externalUrlContainer = document.getElementById('external-url-container');
		
			customRouteContainer.style.display = 'none';
			externalUrlContainer.style.display = 'none';
			staticPageContainer.style.display = 'none';
		
		if(type == "EXTERNAL_LINK"){
			externalUrlContainer.style.display = 'block';
		}
		else if(type == "STATIC_PAGE"){
			staticPageContainer.style.display = 'block';
		}
		else if(type == "CUSTOM_COMPONENT"){
			customRouteContainer.style.display = 'block';
		}
	}
</script>

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'footer-menu-form',
	'enableAjaxValidation'=>false,
)); ?>
	<div class="form-group row">
		<?php echo $form->labelEx($model,'text_en', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo $form->textField($model,'text_en',array('size'=>60,'maxlength'=>100, 'value'=>$model->text_en, 'class'=>'form-control')); ?>
			</p>
		</div>
	</div>
	<div class="form-group row">
		<?php echo $form->labelEx($model,'text_pl', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo $form->textField($model,'text_pl',array('size'=>60,'maxlength'=>100, 'value'=>$model->text_pl, 'class'=>'form-control')); ?>
			</p>
		</div>
	</div>
	<div class="form-group row">
		<?php echo $form->labelEx($model,'type', array('class'=>'col-sm-2 form-control-label')); ?>
		<div class="col-sm-10">
			<p class="form-control-static">
			<?php echo $form->dropDownList($model,'type', $model->types, 
				array('options'=>array($model->type=>array('selected'=>true)), 
				'onchange'=>'onTypeSelect();', 'class'=>'form-control')); ?>
			</p>
		</div>
	</div>
	<?php if(strtolower(Yii::app()->controller->action->id) == 'create'){ ?>
		<div id="static-page-container" style="display:none;">
			<div class="form-group row">
				<?php echo $form->labelEx($model,'static_page', array('class'=>'col-sm-2 form-control-label')); ?>
				<div class="col-sm-10">
					<p class="form-control-static">
					<?php echo $form->dropDownList($model,'static_page', CHtml::listData(StaticPage::model()->findAll(), 'id', 'title_en'), 
					array('options'=>array($model->type=>array('selected'=>true)), 
					'onchange'=>'onTypeSelect();', 'class'=>'form-control')); ?>
					</p>
				</div>
			</div>
		</div>
		<div id="custom-route-container" style="display:none;">
			<div class="form-group row">
				<?php echo $form->labelEx($model,'custom_route', array('class'=>'col-sm-2 form-control-label')); ?>
				<div class="col-sm-10">
					<p class="form-control-static">
						<?php echo $form->textField($model,'custom_route',array('size'=>60,'maxlength'=>100, 'value'=>$model->custom_route, 'class'=>'form-control')); ?>
					</p>
				</div>
			</div>
		</div>
		<div id="external-url-container" style="display:none;">
			<div class="form-group row">
				<?php echo $form->labelEx($model,'external_url', array('class'=>'col-sm-2 form-control-label')); ?>
				<div class="col-sm-10">
					<p class="form-control-static">
						<?php echo $form->textField($model,'external_url',array('size'=>60,'maxlength'=>100, 'value'=>$model->external_url, 'class'=>'form-control')); ?>
					</p>
				</div>
			</div>
		</div>
	<?php } else { ?>
		<div id="external-url-container" style="display:<?php echo ($model->type == 'EXTERNAL_LINK') ? 'block' : 'none';?>">
			<div class="form-group row">
				<?php echo $form->labelEx($model,'external_url', array('class'=>'col-sm-2 form-control-label')); ?>
				<div class="col-sm-10">
					<p class="form-control-static">
						<?php echo $form->textField($model,'external_url',array('size'=>60,'maxlength'=>100, 'value'=>$model->external_url, 'class'=>'form-control')); ?>
					</p>
				</div>
			</div>
		</div>
		<div id="static-page-container" style="display:<?php echo ($model->type == 'STATIC_PAGE') ? 'block' : 'none'; ?>">
			<div class="form-group row">
				<?php echo $form->labelEx($model,'static_page', array('class'=>'col-sm-2 form-control-label')); ?>
				<div class="col-sm-10">
					<p class="form-control-static">
					<?php echo $form->dropDownList($model,'static_page', CHtml::listData(StaticPage::model()->findAll(), 'id', 'title_en'), 
					array('options'=>array($model->type=>array('selected'=>true)), 
					'onchange'=>'onTypeSelect();', 'class'=>'form-control')); ?>
					</p>
				</div>
			</div>
		</div>
		<div id="custom-route-container" style="display:<?php echo ($model->type == 'CUSTOM_COMPONENT') ? 'block' : 'none'; ?>">
			<div class="form-group row">
				<?php echo $form->labelEx($model,'custom_route', array('class'=>'col-sm-2 form-control-label')); ?>
				<div class="col-sm-10">
					<p class="form-control-static">
						<?php echo $form->textField($model,'custom_route',array('size'=>60,'maxlength'=>100, 'value'=>$model->custom_route, 'class'=>'form-control')); ?>
					</p>
				</div>
			</div>
		</div>
	<?php } ?>
	<div class="form-group row">
		<label class='col-sm-2 form-control-label'></label>
		<div class="col-sm-10">
			<p class="form-control-static">
				<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save', array('class'=>'btn btn-inline', 'onclick'=>'return validate();', 'onsubmit'=>'return validate()')); ?>
			</p>
		</div>
	</div>

<?php $this->endWidget(); ?>