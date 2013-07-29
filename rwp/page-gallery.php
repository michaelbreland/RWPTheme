<?php
/**
 * Template Name: Gallery
 */
get_header(); ?>
		<div id="primary" class="site-content">
			<div id="content" role="main">
					<ul class="load-portfolio">
						<li class="active"><a href="#" class="all">All</a></li>
						<!-- Filter Links -->
						<?php
						$args = array( 'taxonomy' => 'ds-gallery-category' );
						$terms = get_terms('ds-gallery-category', $args);
						$count = count($terms); $i=0;
						if ($count > 0) {
							$cape_list = '';
							foreach ($terms as $term) {
								$i++;
								$term_list .= '<li><a href="#" class="'. $term->name .'">' . $term->name . '</a></li>';
								if ($count != $i) $term_list .= ''; else $term_list .= '';
							}
							echo $term_list;
						}
						 ?>
					</ul>
					<ul class="portfolio-grid">
					<!-- Portfolio Thumbs and Titles -->

						<?php
						$pfportfolio = new WP_Query( 'post_type=ds-gallery' );
						while ( $pfportfolio->have_posts() ) : $pfportfolio->the_post();?>
						
						<?php
						
							echo '<li data-id="post-'.get_the_ID().'" data-type="'.$terms_as_text = strip_tags( get_the_term_list( $post->ID, 'ds-gallery-category', '', ' ', '' ) ).'">';?>
							<a href="<?php the_permalink();?>">
							<?php the_post_thumbnail('gallery-thumb');?>
							</a>
							<?php
							echo '<span class="portfolio-title">';
							the_title();
							echo '</span>';
							echo '</li>';
							endwhile;
							wp_reset_postdata();
							?>
							
					</ul>
					
			</div>
		</div>
<?php get_footer(); ?>