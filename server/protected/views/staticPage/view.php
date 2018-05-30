<div class="container-fluid">
	<header class="section-header">
		<div class="tbl">
			<div class="tbl-row">
				<div class="tbl-cell">
					<h2>Page Detail</h2>
					<div class="subtitle"></div>
				</div>
			</div>
		</div>
	</header>
	<div class="box-typical box-typical-padding">
		<div class="form-group row">
			<label class="col-sm-2 form-control-label">Title (English)</label>
			<div class="col-sm-10">
				<p class="form-control-static">
					<?php echo $model->title_en; ?>
				</p>
			</div>
		</div>
		<div class="form-group row">
			<label class="col-sm-2 form-control-label">Title (Polish)</label>
			<div class="col-sm-10">
				<p class="form-control-static">
					<?php echo $model->title_pl; ?>
				</p>
			</div>
		</div>
		<div class="form-group row">
			<label class="col-sm-2 form-control-label">Heading (English)</label>
			<div class="col-sm-10">
				<p class="form-control-static">
					<?php echo $model->heading_en; ?>
				</p>
			</div>
		</div>
		<div class="form-group row">
			<label class="col-sm-2 form-control-label">Heading (Polish)</label>
			<div class="col-sm-10">
				<p class="form-control-static">
					<?php echo $model->heading_pl; ?>
				</p>
			</div>
		</div>
		<div class="form-group row">
			<label class="col-sm-2 form-control-label">Body (English)</label>
			<div class="col-sm-10">
				<p class="form-control-static">
					<?php echo $model->body_en; ?>
				</p>
			</div>
		</div>
		<div class="form-group row">
			<label class="col-sm-2 form-control-label">Body (Polish)</label>
			<div class="col-sm-10">
				<p class="form-control-static">
					<?php echo $model->body_pl; ?>
				</p>
			</div>
		</div>
	</div>
</div>
