import numpy as np

def generate_pq_torus(p, q):
    """
        Returns the matrix representation of a knot mosaic of a (p,q) torus knot.
        Requires p to be less than or equal to q.
    """
    # Dimensions of mosaic should be p + q + 1
    n = p + q + 1
    return 