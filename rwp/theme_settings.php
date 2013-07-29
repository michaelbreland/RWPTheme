<?php 

// Register new options/settings
add_action('admin_init', 'g_theme_settings_init' );

function g_theme_settings_init(){
	register_setting( 'g_theme_settings', 'g_settings', 'g_no_html');
}

function g_no_html($input) {
	$input = $input;
	return $input; // return validated input
}

function g_theme_settings(){
?>
<div class="wrap">
	<div id="icon-themes" class="icon32"><br /></div>
	<h2>Parallax Theme Settings</h2>
	
<form method="post" action="options.php">
			<?php settings_fields('g_theme_settings'); ?>
			<?php $options = get_option('g_settings'); ?>
			<?php $tcmcount = 1 ; ?>
			
			<h3>Homepage Feature Rotator</h3>
			<p>Images should be 930px wide by 350px high</p>
			<table class="form-table">
			<tbody>

				<tr valign="top">
				<td><label class="second" for="g_settings[feature1]" >Image 1 URL: </label>
					<input type="text" class="textsmall" name="g_settings[feature1]" size="50" value="<?php echo $options['feature1']; ?>" />
				</td>
				</tr>
				<tr valign="top">
				<td><label class="second" for="g_settings[feature2]" >Image 2 URL: </label>
					<input type="text" class="textsmall" name="g_settings[feature2]" size="50" value="<?php echo $options['feature2']; ?>" />
				</td>
				</tr>
				<tr valign="top">
				<td><label class="second" for="g_settings[feature3]" >Image 3 URL: </label>
					<input type="text" class="textsmall" name="g_settings[feature3]" size="50" value="<?php echo $options['feature3']?>" />
				</td>
				</tr>
				<tr valign="top">
				<td><label class="second" for="g_settings[feature4]" >Image 4 URL: </label>
					<input type="text" class="textsmall" name="g_settings[feature4]" size="50" value="<?php echo $options['feature4']; ?>" />
				</td>
				</tr>
				<tr valign="top">
				<td><label class="second" for="g_settings[feature5]" >Image 5 URL: </label>
					<input type="text" class="textsmall" name="g_settings[feature5]" size="50" value="<?php echo $options['feature5']; ?>" />
				</td>
				</tr>
				<tr valign="top">
				<td><label class="second" for="g_settings[feature6]" >Image 6 URL: </label>
					<input type="text" class="textsmall" name="g_settings[feature6]" size="50" value="<?php echo $options['feature6']; ?>" />
				</td>
				</tr>

			</tbody>
			</table>
			<br/>
			
			<h3>Action Button Options</h3>
			<table class="form-table">
			<tbody>
			<tr valign="top">
			<td><label class="second" for="g_settings[actiondesc]" >Button Description: </label>
				<input type="text" class="textsmall" name="g_settings[actiondesc]" size="50" value="<?php echo $options['actiondesc']; ?>" />
			</td>
			</tr>
			<tr valign="top">
			<td><label class="second" for="g_settings[actionurl]" >Action Button URL: </label>
				<input type="text" class="textsmall" name="g_settings[actionurl]" size="50" value="<?php echo $options['actionurl']; ?>" />
			</td>
			</tr>

			<tr valign="top">
			<td><label class="second" for="g_settings[actiontext]" >Action Button Text: </label>
				<input type="text" class="textsmall" name="g_settings[actiontext]" size="50" value="<?php echo $options['actiontext']; ?>" />
			</td>
			</tr>
			</tbody>
			</table>			
			<br/>
			
			<h3>Other Options</h3>
			<table class="form-table">
			<tbody>
					<tr valign="top">
					<td><label for="g_settings[headercode]" >Header Scripts/Code </label><br/>
					<textarea id="textarea" cols="57" rows="5"  name="g_settings[headercode]" ><?php echo $options['headercode']; ?></textarea></td>
					</tr>
					<tr valign="top">
						<td><label for="g_settings[footercode]" >Footer Scripts/Code </label><br/>
					<textarea id="textarea" cols="57" rows="5"  name="g_settings[footercode]" ><?php echo $options['footercode']; ?></textarea></td>
					</tr>
			</tbody>
			</table>
			<br/>


<p><input type="submit" name="search" value="Update Options" class="button" /></p>
</form>

<?php
}
?>