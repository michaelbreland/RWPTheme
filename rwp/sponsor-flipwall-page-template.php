<?php
/*
* Template Name: Sponsor FlipWall
*/
get_header(); ?>
		<div id="primary" class="site-content">
			<div id="content" role="main">
				<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'content', 'sponsor' ); ?>
				<?php endwhile; ?>
			</div>
		</div>
<?php get_sidebar(); ?>
<?php get_footer(); ?>